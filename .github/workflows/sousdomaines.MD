Créer 2 nouvelles config sur Ovh/web Cloud/noms de domaine

Type : A
Sous-domaines : sousdomaine et www.sousdomaine
Cible : le serveur


Sur serveur 

1; Ensite sur le serveur, stopper apache?


2; création clé Lets Encrypt
sudo certbot certonly --standalone -d sousdomaine.nomdomaine.com -d www.sousdomaine.nomdomaine.com

3; Créer fichier config
etc/apache2/site-available

Copier/coller un ficiher existant
config pour le nouveau sous domaine

sudo a2ensite enable?

systemctl restart apache2








ubuntu@vps-26a4b106:/etc/apache2/sites-available$ cat /etc/apache2/sites-available/https-charles.ostudio426.conf
<IfModule mod_ssl.c>
        NameVirtualHost *:443
</IfModule>

<VirtualHost *:443>
        ServerName charles.ostudio426.com
        ServerAlias www.charles.ostudio426.com
        ServerAdmin webmaster@localhost

        <IfModule mod_expires.c>
                ExpiresActive On
                ExpiresDefault "access plus 1 month"
                ExpiresByType image/jpg "access plus 1 month"
                ExpiresByType image/jpeg "access plus 1 month"
                ExpiresByType image/gif "access plus 1 month"
                ExpiresByType image/png "access plus 1 month"
                ExpiresByType text/css "access plus 1 month"
                ExpiresByType application/javascript "access plus 1 month"
        </IfModule>

        # HTTPS certificate
        SSLEngine on
        SSLCertificateFile /etc/letsencrypt/live/charles.ostudio426.com/fullchain.pem
        SSLCertificateKeyFile /etc/letsencrypt/live/charles.ostudio426.com/privkey.pem
        SSLCertificateChainFile /etc/letsencrypt/live/charles.ostudio426.com/chain.pem


        # Proxy for jukebox
        ProxyPass /jukebox/ http://127.0.0.1:8084/
        ProxyPassReverse /jukebox/ http://127.0.0.1:8084/

        # Proxy for zombie
        ProxyPass /zombie/ http://127.0.0.1:8082/
        ProxyPassReverse /zombie/ http://127.0.0.1:8082/

        # Proxy for webFps : front
        ProxyPass /webfps/ http://127.0.0.1:8085/
        ProxyPassReverse /webfps/ http://127.0.0.1:8085/
        # Proxy for webFps : back
        ProxyPass /webfps-back/ http://127.0.0.1:3000/
        ProxyPassReverse /webfps-back/ http://127.0.0.1:300/
        # Proxy for webFps : WebSocket
        ProxyPass /webfps-socket/ ws://127.0.0.1:3000/
        ProxyPassReverse /webfps-socket/ ws://127.0.0.1:3000/

        # Proxy for EtoileDeBagarre websocket
        ProxyPass /ws-edb/ ws://127.0.0.1:5025/
        ProxyPassReverse /ws-edb/ ws://127.0.0.1:5025/

        ## Proxy for portfolio
        ProxyPass / http://127.0.0.1:8081/
        ProxyPassReverse / http://127.0.0.1:8081/


        ErrorLog ${APACHE_LOG_DIR}/charles-ostudio426-error.log
        CustomLog ${APACHE_LOG_DIR}/charles-ostudio426-access.log combined

</VirtualHost>

# Do not need VirtualHost 80 because we only use https for web services
ubuntu@vps-26a4b106:/etc/apache2/sites-available$

