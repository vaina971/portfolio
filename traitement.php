<?php
// Informations de connexion à la base de données sur Render
$servername = "LE_HOST_RENDER";       // Remplace par le Host de Render
$username = "LE_USER_RENDER";         // Remplace par le User de Render
$password = "LE_PASSWORD_RENDER";     // Remplace par le Password de Render
$dbname = "portfolio";                // Le nom de la base de données
$port = "5432";                       // Le port par défaut de PostgreSQL

// Connexion à la base de données
try {
    $conn = new PDO("pgsql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Récupération des données du formulaire
    $prenom = htmlspecialchars($_POST['prenom']);
    $email = htmlspecialchars($_POST['email']);
    $telephone = htmlspecialchars($_POST['telephone']);
    $message = htmlspecialchars($_POST['message']);

    // Requête SQL pour insérer les données
    $sql = "INSERT INTO messages (prenom, email, telephone, message) 
            VALUES (:prenom, :email, :telephone, :message)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':prenom', $prenom);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':telephone', $telephone);
    $stmt->bindParam(':message', $message);
    $stmt->execute();

    echo "<script>alert('Message envoyé avec succès !'); window.location.href='index.html';</script>";

} catch (PDOException $e) {
    echo "Erreur lors de l'envoi du message : " . $e->getMessage();
}
?>
