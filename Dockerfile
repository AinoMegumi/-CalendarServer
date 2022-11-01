FROM node:latest
ARG USERNAME=jpcalsrv
ARG INSTALL_DIR=/home/{USERNAME}/server
ARG UID=4000
ARG GID=4000
EXPOSE 8900

RUN groupadd -g ${GID} ${USERNAME} &&\
    useradd -u ${UID} -g ${GID} -m -s /bin/bash ${USERNAME}
USER ${USERNAME} 
WORKDIR /home/${USERNAME}
ADD server.tar ./
WORKDIR /home/${USERNAME}/server
SHELL ["/bin/bash", "-c"]
RUN npm ci
CMD ["/bin/bash"]
