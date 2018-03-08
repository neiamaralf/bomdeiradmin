<?php
header('Access-Control-Allow-Origin: *');
include 'conexao.php';

switch($key) { 
case "adduser":
  $name=$json_obj-> {'name'};
  $password=$json_obj-> {'password'};
  $email=$json_obj-> {'email'};
  $update="INSERT INTO usuarios(nome,senha,email,tipo) VALUES('$name','$password','$email',0)";
  
  try {
    $qr=$pdo->query($update);
    if($qr) {     
        $stmt=$pdo->query("SELECT * FROM usuarios WHERE email='$email' ");
        if($row=$stmt->fetch(PDO::FETCH_OBJ)) {          
          echo json_encode(array('status'=>'success','user'=>$row));
        }          
    }
    else
     echo json_encode(array('status'=>'erro','msg'=>'Problema desconhecido, contate o programador: neiamaralf@athena3d.com.br'));
  }
  catch(PDOException $e) {
    echo json_encode(array('status'=>'erro','msg'=>$e->getMessage()));
  }
  break;
}


?>