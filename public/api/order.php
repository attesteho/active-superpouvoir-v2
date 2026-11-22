<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Méthode non autorisée']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

$nom = trim((string)($input['nom'] ?? ''));
$email = trim((string)($input['email'] ?? ''));
$telephone = trim((string)($input['telephone'] ?? ''));
$pays = trim((string)($input['pays'] ?? ''));
$ville = trim((string)($input['ville'] ?? ''));
$adresse = trim((string)($input['adresse'] ?? ''));
$complement = trim((string)($input['complement'] ?? ''));
$livraison = trim((string)($input['livraison'] ?? ''));
$paiement = trim((string)($input['paiement'] ?? ''));
$reference = trim((string)($input['reference'] ?? ''));
$items = is_array($input['items'] ?? null) ? $input['items'] : [];
$subtotal = (float)($input['subtotal'] ?? 0);
$frais = (float)($input['frais'] ?? 0);
$total = (float)($input['total'] ?? 0);

if ($nom === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $reference === '' || !count($items)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Champs invalides']);
    exit;
}

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Configuration serveur manquante']);
    exit;
}
$config = require $configPath;

define('SMTP_HOST', $config['smtp_host']);
define('SMTP_PORT', $config['smtp_port']);
define('SMTP_USER', $config['smtp_user']);
define('SMTP_PASS', $config['smtp_pass']);
$mailTo = is_array($config['mail_to']) ? $config['mail_to'] : [$config['mail_to']];
if (!in_array($email, $mailTo, true)) {
    $mailTo[] = $email;
}

function smtp_read(&$socket): string {
    $response = '';
    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }
    return $response;
}

function smtp_command(&$socket, ?string $command, ?int $expectedCode = null): string {
    if ($command !== null) {
        fwrite($socket, $command . "\r\n");
    }
    $response = smtp_read($socket);
    if ($expectedCode !== null && strpos($response, (string)$expectedCode) !== 0) {
        throw new RuntimeException("Réponse SMTP inattendue pour \"{$command}\": {$response}");
    }
    return $response;
}

function fcfa_format(float $value): string {
    return number_format($value, 0, ',', ' ') . ' FCFA';
}

try {
    $socket = @stream_socket_client(
        'tcp://' . SMTP_HOST . ':' . SMTP_PORT,
        $errno,
        $errstr,
        15
    );
    if (!$socket) {
        throw new RuntimeException("Connexion SMTP échouée: {$errstr}");
    }

    smtp_command($socket, null, 220);
    smtp_command($socket, 'EHLO digifemmes.com', 250);
    smtp_command($socket, 'STARTTLS', 220);

    if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
        throw new RuntimeException('Échec de la négociation TLS');
    }

    smtp_command($socket, 'EHLO digifemmes.com', 250);
    smtp_command($socket, 'AUTH LOGIN', 334);
    smtp_command($socket, base64_encode(SMTP_USER), 334);
    smtp_command($socket, base64_encode(SMTP_PASS), 235);

    $date = date('d/m/Y à H:i');

    $safe = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');

    $livraisonLabel = $livraison === 'express' ? 'Express (1 à 3 jours)' : 'Standard (3 à 7 jours)';
    $paiementLabels = [
        'mobile' => 'Mobile Money',
        'virement' => 'Virement bancaire',
        'livraison' => 'Paiement à la livraison',
    ];
    $paiementLabel = $paiementLabels[$paiement] ?? $paiement;

    $itemsRows = '';
    foreach ($items as $item) {
        $itemNom = $safe($item['nom'] ?? '');
        $itemFormat = $safe($item['format'] ?? '');
        $itemQuantite = (int)($item['quantite'] ?? 0);
        $itemPrix = (float)($item['fcfa'] ?? 0);
        $itemTotal = fcfa_format($itemPrix * $itemQuantite);
        $itemsRows .= <<<HTML
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #4a2461;color:#FFF0D9;font-size:14px;">
            <strong>{$itemNom}</strong><br><span style="color:#C9A8D9;font-size:12px;">{$itemFormat} · {$itemQuantite} × {$safe(fcfa_format($itemPrix))}</span>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #4a2461;color:#FFB000;font-size:14px;text-align:right;font-weight:700;">{$itemTotal}</td>
        </tr>
HTML;
    }

    $subject = "Nouvelle commande {$reference} — {$nom}";
    $htmlBody = <<<HTML
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#321044;">
  <div style="padding:28px 24px;border-bottom:2px solid #FFB000;">
    <p style="margin:0 0 4px;color:#FFB000;font-size:11px;letter-spacing:2px;text-transform:uppercase;">La Fabrique des Héros</p>
    <h1 style="color:#FFF0D9;font-size:22px;margin:0;">Nouvelle commande — {$safe($reference)}</h1>
  </div>
  <div style="padding:24px;">
    <p style="margin:0 0 6px;color:#FFF0D9;font-size:14px;"><strong>Client :</strong> {$safe($nom)}</p>
    <p style="margin:0 0 6px;color:#FFF0D9;font-size:14px;"><strong>E-mail :</strong> {$safe($email)}</p>
    <p style="margin:0 0 6px;color:#FFF0D9;font-size:14px;"><strong>Téléphone :</strong> {$safe($telephone)}</p>
    <p style="margin:0 0 6px;color:#FFF0D9;font-size:14px;"><strong>Adresse :</strong> {$safe($adresse)}{$safe($complement ? ', ' . $complement : '')}, {$safe($ville)}, {$safe($pays)}</p>
    <p style="margin:0 0 16px;color:#FFF0D9;font-size:14px;"><strong>Livraison :</strong> {$safe($livraisonLabel)} &nbsp;·&nbsp; <strong>Paiement :</strong> {$safe($paiementLabel)}</p>

    <table style="width:100%;border-collapse:collapse;margin-top:8px;">
      {$itemsRows}
    </table>

    <table style="width:100%;margin-top:14px;">
      <tr><td style="color:#C9A8D9;font-size:13px;">Sous-total</td><td style="color:#FFF0D9;font-size:13px;text-align:right;">{$safe(fcfa_format($subtotal))}</td></tr>
      <tr><td style="color:#C9A8D9;font-size:13px;">Livraison</td><td style="color:#FFF0D9;font-size:13px;text-align:right;">{$safe($frais > 0 ? fcfa_format($frais) : 'Offerte')}</td></tr>
      <tr><td style="color:#FFB000;font-size:16px;font-weight:800;padding-top:8px;">Total</td><td style="color:#FFB000;font-size:16px;font-weight:800;text-align:right;padding-top:8px;">{$safe(fcfa_format($total))}</td></tr>
    </table>

    <p style="margin:20px 0 0;color:#C9A8D9;font-size:11px;">Reçue le {$date} depuis le formulaire de commande de jactivemonsuperpouvoir.com</p>
  </div>
</div>
HTML;

    $textLines = ["Nouvelle commande {$reference}", ""];
    foreach ($items as $item) {
        $textLines[] = "- " . ($item['quantite'] ?? 0) . " x " . ($item['nom'] ?? '') . " (" . ($item['format'] ?? '') . ")";
    }
    $textLines[] = "";
    $textLines[] = "Client : {$nom}";
    $textLines[] = "E-mail : {$email}";
    $textLines[] = "Téléphone : {$telephone}";
    $textLines[] = "Adresse : {$adresse}" . ($complement ? ", {$complement}" : "") . ", {$ville}, {$pays}";
    $textLines[] = "Livraison : {$livraisonLabel}";
    $textLines[] = "Paiement : {$paiementLabel}";
    $textLines[] = "Total : " . fcfa_format($total);
    $textLines[] = "";
    $textLines[] = "Reçue le {$date} depuis le formulaire de commande de jactivemonsuperpouvoir.com";
    $textBody = implode("\r\n", $textLines);

    $nomEnTete = str_replace(["\r", "\n"], '', $nom);
    $boundary = 'np_' . bin2hex(random_bytes(12));
    $headers = [
        'Date: ' . date('r'),
        'Message-ID: <' . bin2hex(random_bytes(8)) . '.' . time() . '@digifemmes.com>',
        'From: La Fabrique des Héros <' . SMTP_USER . '>',
        'To: ' . implode(', ', $mailTo),
        'Reply-To: ' . $nomEnTete . ' <' . $email . '>',
        'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ];

    $body = "--{$boundary}\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . $textBody . "\r\n\r\n"
        . "--{$boundary}\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . $htmlBody . "\r\n\r\n"
        . "--{$boundary}--";

    $data = implode("\r\n", $headers) . "\r\n\r\n" . $body;
    $data = preg_replace('/\r\n\./', "\r\n..", $data);

    smtp_command($socket, 'MAIL FROM:<' . SMTP_USER . '>', 250);
    foreach ($mailTo as $recipient) {
        smtp_command($socket, 'RCPT TO:<' . $recipient . '>', 250);
    }
    smtp_command($socket, 'DATA', 354);
    fwrite($socket, $data . "\r\n.\r\n");
    smtp_command($socket, null, 250);
    smtp_command($socket, 'QUIT', 221);
    fclose($socket);

    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}
