FROM httpd:2.4
COPY ../VoidEyeGames/ /usr/local/apache2/htdocs/
COPY ../VoidEyeGames/utils/.htaccess /usr/local/apache2/htdocs/