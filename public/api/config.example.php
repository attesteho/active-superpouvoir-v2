<?php
// Copier ce fichier en config.php et renseigner les vraies valeurs.
// config.php est ignoré par git (voir .gitignore) car il contient des secrets.
return [
    'smtp_host' => 'smtp.gmail.com',
    'smtp_port' => 587,
    'smtp_user' => 'your-smtp-user@example.com',
    'smtp_pass' => 'your-app-password',
    'mail_to' => ['destination1@example.com', 'destination2@example.com'],
];
