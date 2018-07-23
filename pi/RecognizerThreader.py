#This class on start() starts two threads. One the decodes frames from 
#an ip camera and the other thread encodes the faces found in the frame
#if any. The array of encodings can be grabbed using encode_read()


import sys
#allows usage of cv2 and face_recognition
sys.path.append('/usr/local/lib/python2.7/site-packages')
sys.path.append('/usr/local/lib/python2.7/dist-packages')

import image
import face_recognition
import numpy as np

from threading import Thread
import cv2
from video import create_capture
import imutils
import time
#import queue depending on what python version
if sys.version_info >= (3, 0):
    from queue import Queue

# otherwise, import the Queue class for Python 2.7
else:
    from Queue import Queue

#class to be instantiated in runner to allow threading
class VideoStream:
    #init function thats called on instantiation
    def __init__(self, queueSize=50):
        #initialize camera
        self.cam = cv2.VideoCapture("rtsp://10.0.0.247:554/11")

	print ("init")
        #instantiate the queues and set their max size
        self.Q = Queue(maxsize=queueSize)
	self.encodeQ = Queue(maxsize=queueSize)


        #this flag will be true when we want the process to end
        self.stopped = False

    #start the threads
    def start(self):
        # start the thread to read frames from the video stream
        tOne = Thread(target=self.update, args=())
        tOne.daemon = True
        tOne.start()

        tTwo = Thread(target=self.face_encoding, args=())
        tTwo.daemon = True
        time.sleep(2.0)
        tTwo.start()
        return self


    #function that polls the frame queue
    def read(self):
        # return the frame most recently read
        #print (self.Q.qsize())
        return self.Q.get()

    #this reads from the encode queue
    def encode_read(self):
        return self.encodeQ.get()

    #this updates the frame queue
    def update(self):
        # keep looping infinitely until the thread is stopped
        #print ("starting stream")
	while True:
            # if the thread indicator variable is set, stop the
            # thread
            if self.stopped:
                return

            #we want to reduce frame rate to allow us to process frames regular$
            #this grabs 4 frames and throws them out without any processing
            if self.Q.qsize() < 1:
                (grabbed, frame) = self.cam.read()
                # Resize frame of video to 1/4 size for faster face recognition processing
		small_frame = cv2.resize(frame, (0, 0), fx=1, fy=1)

    		# Convert the image from BGR color (which OpenCV uses) to RGB color (which $
    		rgb_small_frame = small_frame[:, :, ::-1]

		# add the frame to the queue
                self.Q.put(rgb_small_frame)
            else:
                self.cam.grab()

    #read from the camera and get the face encodings
    def face_encoding(self):
	#print("started encoding")
	while True:
	    if self.stopped:
        	return
	    frame = self.read()
	    rgb_small_frame = imutils.resize(frame, width=400)
	    face_locations = face_recognition.face_locations(rgb_small_frame)
	    self.encodeQ.put(face_recognition.face_encodings(rgb_small_frame, face_locations))
	    #cv2.imshow('Video', rgb_small_frame)
	    #key = cv2.waitKey(1) & 0xFF

    #function that stops the thread safely
    def stop(self):
        # indicate that the thread should be stopped
        self.stopped = True
        time.sleep(2.0)
        self.cam.release()
        print ("\nFacial Recognition stopped and camera released")
        return

    #i dont use this right now, but could be usefull for 
    #flushing queues and restarting
    def flush(self):
        while not self.Q.empty():
            self.Q.get()
        self.cam = cv2.VideoCapture("rtsp://10.0.0.247:554/11")
        self.stopped = False

