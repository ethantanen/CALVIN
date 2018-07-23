This folder has two different programs. runner.py and threader.py run a facial detection program that posts frames with faces in them to an endpoint.

Since it is threaded it allows for very quick facial detection. Usage: python runner.py

The second program is a facial recognition program run through RecognizerRunner.py and RecognizerThreader.py. This utilizes three threads to run facial recognition with a latency of 4 seconds. If you have included image files for people to be recognized you can encode them and their names will print out if they have been recognized

Dependencies. Both programs need opencv, and imutils installed. While the recognition program needs to have face_recognition and image installed as well
