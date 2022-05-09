

Steps to run nitrous locally.

Go to terminal
cd nitrous-vyb-fork
docker build -t="myname/condenser:mybranch" .
docker run -it -p 8080:8080 myname/condenser:mybranch

From browser:
http://localhost:8080/

