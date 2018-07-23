#class to be instantiated in runner to allow threading
import sys
#allows usage of cv2
sys.path.append('/usr/local/lib/python2.7/site-packages')

import numpy as np

from threading import Thread
import cv2
from video import create_capture

import time
#import queue depending on what python version
if sys.version_info >= (3, 0):
    from queue import Queue

# otherwise, import the Queue class for Python 2.7
else:
    from Queue import Queue

#class to be instantiated in runner to allow threading
class PiVideoStream:
    #init function thats called on instantiation
    def __init__(self, queueSize=50):
	#initialize camera
	self.cam = cv2.VideoCapture("rtsp://10.0.0.247:554/11")

	#instantiate the queue and set its max size
	self.Q = Queue(maxsize=queueSize)


	#this flag will be true when we want the process to end
	self.stopped = False

    def flush(self):
	while not self.Q.empty():
	    self.Q.get()
	self.cam = cv2.VideoCapture("rtsp://10.0.0.247:554/11")
	self.stopped = False

    #function that polls the queue
    def read(self):
	# return the frame most recently read
        print (self.Q.qsize())
	return self.Q.get()

    #function that stops the thread safely
    def stop(self):
	# indicate that the thread should be stopped
	self.stopped = True

    #start the thread
    def start(self):
	# start the thread to read frames from the video stream
	t = Thread(target=self.update, args=())
	t.daemon = True
	t.start()
	return self

    def update(self):
	# keep looping infinitely until the thread is stopped
	while True:
	    # if the thread indicator variable is set, stop the
	    # thread
	    if self.stopped:
		return

	    #we want to reduce frame rate to allow us to process frames regularly
	    #this grabs 4 frames and throws them out without any processing
	    if self.Q.qsize() < 1:
		(grabbed, frame) = self.cam.read()
            	# add the frame to the queue
		self.Q.put(cv2.equalizeHist(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)))
	    else:
		self.cam.grab()

