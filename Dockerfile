# Utiliser l'image PHP officielle
FROM php:8.1-apache

# Copier le contenu de ton projet dans le dossier de l'image
COPY . /var/www/html/

# Exposer le port 80
EXPOSE 80

# Lancer le serveur Apache
CMD ["apache2-foreground"]
