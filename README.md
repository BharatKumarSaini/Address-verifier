# Address-verifier
REST API which takes google takeout data and finds your home and workplace

#  git clone https://github.com/BharatKumarSaini/Address-verifier
this will clone this repo to your current working directory

# cd Address-verifier

install all the node modules 
# npm i 

create .env file and add API_KEY="your api key from here" https://platform.here.com/admin/
# echo API_KEY='your api key' > .env

 run server.js with node
# node server.js

# hit the endpoint of POST API :- http://localhost:5001/find 
# send the following data :-
# userData : Records.json file
# address : the location you want to search
# limit : no. of locations to search

