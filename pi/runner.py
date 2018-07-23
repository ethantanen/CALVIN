#this is a multithreaded program that pulls from another class
#called PiVideoStream that pulls frames from an ip video camera
#and looks for faces in the frames, if there are faces sends
#the image to the endpoint which right now is the internserver


# import the necessary packages
from __future__ import print_function

import sys
#allows cv2 usage
sys.path.append('/usr/local/lib/python2.7/site-packages')
sys.path.append('/usr/local/lib/python2.7/dist-packages')
import image
import face_recognition
import base64
import numpy as np
import cv2
import requests
import json

# local modules
import imutils
import time
import cv2
from threader import PiVideoStream


#the cascade used for face detection
cascade_fn = "/usr/local/share/OpenCV/haarcascades/haarcascade_frontalface_alt.xml"
#eyes cascade
nested_fn  = "/usr/local/share/OpenCV/haarcascades/haarcascade_eye.xml"

endpoint = "http://internserver.ventera.com:8000/s3"

cascade = cv2.CascadeClassifier(cascade_fn)
nested = cv2.CascadeClassifier(nested_fn)

#start the thread for image getting
vs = PiVideoStream().start()
time.sleep(2.0)

#loop over the frames
while True:

    frame = vs.read()

    #an array that holds the faces
    frame = imutils.resize(frame, width=400)
    faces = cascade.detectMultiScale(
            frame,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30,30),
            )
    cv2.imshow("Frame", frame)
    key = cv2.waitKey(1) & 0xFF

    #if the frame has a face send it to the database for facial recognition
    #set a counterprint  for x amount of frames to skip over before sending another photo
    if len(faces) > 0:
	print ("face detected")
	#vs.stop()
	data = {'info':base64.encodestring(frame)}
	response = requests.post(url = endpoint, json = data)
	print (response)
	break
	#vs.flush()
	#vs.start()

    #cv2.imshow("Frame", frame)
    #key = cv2.waitKey(1) & 0xFF

#clean up
cv2.destroyAllWindows()
vs.stop()
