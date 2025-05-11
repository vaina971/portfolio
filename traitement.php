<?php
// Informations de connexion à la base de données sur Render
$servername = "dpg-d0gi2gbuibrs73fl8ijg-a";       
$username = "portfolio_db_r1so_user";         
$password = "xL4iKSYQONnWIFaxoG9g8ZmYZeSW5scn";     
$dbname = "portfolio_db_r1so";                
$port = "5432";                       

// Connexion à la base de données
try {
    $conn = new PDO("pgsql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connexion réussie à la base de données";
} catch (PDOException $e) {
    echo "Erreur de connexion : " . $e->getMessage();
}
?>

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
