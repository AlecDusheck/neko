FROM debian:stretch-slim

#
# avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

#
# install neko dependencies
RUN set -eux; apt-get update; \
    apt-get install -y --no-install-recommends pulseaudio openbox dbus-x11 xserver-xorg-video-dummy supervisor; \
    apt-get install -y --no-install-recommends libcairo2 libxcb1 libxrandr2 libxv1 libopus0 libvpx4; \
    #
    # clean up
    apt-get clean -y; \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/*

#
# add gst to env
ENV PATH=/gst/local/bin:$PATH
ENV LD_LIBRARY_PATH=/gst/local/lib:$LD_LIBRARY_PATH
ENV PKG_CONFIG_PATH=/gst/local/lib/pkgconfig:$PKG_CONFIG_PATH

#
# copy gst
COPY .build/gst/local /gst/local/

ARG USERNAME=neko
ARG USER_UID=1000
ARG USER_GID=$USER_UID

#
# install neko dependencies
RUN set -eux; apt-get update; \
    apt-get install -y --no-install-recommends wget ca-certificates; \
    #
    # create a non-root user
    groupadd --gid $USER_GID $USERNAME; \
    useradd --uid $USER_UID --gid $USERNAME --shell /bin/bash --create-home $USERNAME; \
    adduser $USERNAME audio; \
    adduser $USERNAME video; \
    adduser $USERNAME pulse; \
    #
    # setup pulseaudio
    mkdir -p /home/$USERNAME/.config/pulse/; \
    echo "default-server=unix:/tmp/pulseaudio.socket" > /home/$USERNAME/.config/pulse/client.conf; \
    #
    # workaround for an X11 problem: http://blog.tigerteufel.de/?p=476
    mkdir /tmp/.X11-unix; chmod 1777 /tmp/.X11-unix; chown $USERNAME /tmp/.X11-unix/; \
    #
    # make directories for neko
    mkdir -p /etc/neko /var/www /var/log/neko; chmod 1777 /var/log/neko; chown $USERNAME /var/log/neko/;  \
    chown -R $USERNAME:$USERNAME /home/$USERNAME; \
    #
    # clean up
    apt-get clean -y; \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/*

#
# env
ENV USER=$USERNAME
ENV DISPLAY=:99.0
ENV NEKO_PASSWORD=neko
ENV NEKO_PASSWORD_ADMIN=admin
ENV NEKO_BIND=:8080

#
# neko config
COPY .docker/files/dbus /usr/bin/dbus
COPY .docker/files/openbox.xml /etc/neko/openbox.xml
COPY .docker/files/supervisord.conf /etc/neko/supervisord.conf
COPY .docker/files/xorg.conf /etc/neko/xorg.conf
COPY .docker/files/default.pa /etc/pulse/default.pa
COPY .docker/files/neko/supervisord.conf /etc/neko/supervisord/neko.conf

#
# neko dist
COPY client/dist/ /var/www
COPY server/bin/neko /usr/bin/neko

#
# run neko
CMD ["/usr/bin/supervisord", "-c", "/etc/neko/supervisord.conf"]

#
# install firefox-esr
RUN set -eux; apt-get update; \
    apt-get install -y --no-install-recommends firefox-esr; \
    #
    # install extensions
    mkdir -p /usr/lib/firefox-esr/distribution/extensions; \
    wget -O /usr/lib/firefox-esr/distribution/extensions/uBlock0@raymondhill.net.xpi https://addons.mozilla.org/firefox/downloads/latest/ublock-origin/latest.xpi; \
    wget -O /usr/lib/firefox-esr/distribution/extensions/nordvpnproxy@nordvpn.com.xpi https://addons.mozilla.org/firefox/downloads/latest/nordvpn-proxy-extension/latest.xpi; \
    #
    # clean up
    apt-get clean -y; \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/*

#
# copy configuation files
COPY .docker/files/simplyalec/supervisord.conf /etc/neko/supervisord/firefox.conf
COPY .docker/files/simplyalec/neko.js /usr/lib/firefox-esr/mozilla.cfg
COPY .docker/files/simplyalec/autoconfig.js /usr/lib/firefox-esr/defaults/pref/autoconfig.js
COPY .docker/files/simplyalec/policies.json /usr/lib/firefox-esr/distribution/policies.json
