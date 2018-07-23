#this class utitilizes RecognizerThreader, opencv, and face recognition to
#recognize faces from an ip camera in a multi threaded program. One has to 
#encode image files of people and use the known_face_names array so that
#the program can print out names when recognized. 
#On raspberry pi has a latency of 4 seconds before recognition. 
from __future__ import print_function

import sys
#allows cv2 and face_recognition usage
sys.path.append('/usr/local/lib/python2.7/site-packages')
sys.path.append('/usr/local/lib/python2.7/dist-packages')

import image
import face_recognition
import base64
import numpy as np
import cv2
import requests
import json

import imutils
import time
import cv2
from RecognizerThreader import VideoStream

#here is where we will put the face encodings from the
#the pictures grabbed from the server
known_face_encodings = []
#names of the faces
known_face_names = [
    "Steve",
    "Corrine",
    "Conner"
]

# Initialize some variables
face_locations = []
face_encodings = []
face_names = []

#start the video capturing thread and the facial encoding thread
vs = VideoStream().start()
time.sleep(2.0)

#loop over the frames
try:
    while True:
	#print("start")
	face_names = []
	#grab the encodings from the encoding thread
        for face_encoding in vs.encode_read():
            # See if the face is a match for the known face(s)
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"

	    # If a match was found in known_face_encodings, just use the first one.
            if True in matches:
                first_match_index = matches.index(True)
                name = known_face_names[first_match_index]

	    face_names.append(name)

	#print the names of the people
        print (face_names)
#on keyboard interrupt exit smoothly
except KeyboardInterrupt:
	vs.stop()
	cv2.destroyAllWindows()
	pass
