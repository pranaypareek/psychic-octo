psychic-octo
============

Developing a basic web app using Express.JS

============

Docker Image:

https://registry.hub.docker.com/u/pranay/psychic-octo/

Command to run a container:

"sudo docker run -P pranay/psychic-octo sudo /start.sh"
(-P is used for automatic port mapping between the container and the local host)
After this, "run sudo docker ps" in another terminal to view the PORT mapping (of the specific container) from the container to the local host.

Use the PORT number: "localhost:PORT" (491xx) to access the webapp.
