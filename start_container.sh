#!/bin/bash
# just set few variable
HOST_BASE_DIR=$PWD
HOST_PROJECT_DIR="project"
DOCKER_PROJECT_DIR="/var/www/html"
DS="/"
HOST_FULL_PATH="$HOST_BASE_DIR$DS$HOST_PROJECT_DIR"
DOCKER_MYSQL_DIR="/var/lib/mysql"
HOST_MYSQL_DIR="$HOST_BASE_DIR/var/lib/mysql"
EXPOSED_PORTS="80:80"
NETWORK_NAME="mynetwork"
# myframework:1 = nodejs/npm/tsc/apache2
# myframework:2 = nodejs/npm/tsc/apache2/php/phpmyadmin/mysql
IMAGE_NAME="myframework:2"
CONTAINER_ALIAS="myframework"
ENTRY_POINT="/bin/bash"


# give permission for project
sudo chmod -R 777 $HOST_FULL_PATH

# Show the command :)
sudo docker run -v $HOST_MYSQL_DIR:$DOCKER_MYSQL_DIR -v $HOST_FULL_PATH:$DOCKER_PROJECT_DIR -it --rm -p $EXPOSED_PORTS --network $NETWORK_NAME --privileged --name $CONTAINER_ALIAS $IMAGE_NAME $ENTRY_POINT

