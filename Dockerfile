FROM webdevops/php-apache
RUN apt update
RUN apt install -y nodejs

WORKDIR /
ADD ../VoidEyeGames/ .
ADD ../VoidEyeGames/utils/.htaccess .
ADD ../VoidEyeGames/nodejs.conf /opt/docker/etc/supervisor.d/

EXPOSE 8000
EXPOSE 80

CMD ["supervisord"]