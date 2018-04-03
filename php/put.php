<?php
header('Access-Control-Allow-Origin: *');
include 'conexao.php';

switch($key) { 
case "adduser":
  $name=$json_obj->{'jsondata'}->{'name'};
  $password=$json_obj->{'jsondata'}->{'password'};
  $email=$json_obj->{'jsondata'}->{'email'};
  $super=$json_obj->{'jsondata'}->{'super'};
  $sql="INSERT INTO admins(senha,email,super,datacadastro) VALUES('$password','$email',$super,now())";
  
  try {
    $qr=$pdo->query($sql);
    if($qr) {     
        $stmt=$pdo->query("SELECT * FROM admins WHERE email='$email' ");
        if($row=$stmt->fetch(PDO::FETCH_OBJ)) {          
          echo json_encode(array('status'=>'success','result'=>$row));
        }          
    }
    else
     echo json_encode(array('status'=>'erro','msg'=>'Problema desconhecido, contate o programador: neiamaralf@athena3d.com.br'));
  }
  catch(PDOException $e) {
    echo json_encode(array('status'=>'erro','msg'=>$e->getMessage()));
  }
  break;  
  case "getestilos":
  $op=$json_obj->{'jsondata'}->{'op'};
  if($op=="adicionar"){
    $name=$json_obj->{'jsondata'}->{'name'};
    $idcategoria=$json_obj->{'jsondata'}->{'idcategoria'};
    $sql="INSERT INTO estilos(nome,idcategoria) VALUES('$name',$idcategoria)";  
    try {
      $qr=$pdo->query($sql);
      if($qr) {     
          $stmt=$pdo->query("SELECT * FROM estilos WHERE idcategoria = $idcategoria AND id = (SELECT MAX(ID) FROM estilos WHERE idcategoria = $idcategoria)");
          
          if($row=$stmt->fetch(PDO::FETCH_OBJ)) {          
            echo json_encode(array('status'=>'success','key'=>$key,'result'=>$row));
          }          
      }
      else
       echo json_encode(array('status'=>'erro','msg'=>'Problema desconhecido, contate o programador: neiamaralf@athena3d.com.br'));
    }
    catch(PDOException $e) {
      echo json_encode(array('status'=>'erro','msg'=>$e->getMessage()));
    }

  }
  else{
    $name=$json_obj->{'jsondata'}->{'name'};
    $id=$json_obj->{'jsondata'}->{'id'};  
    $sql="UPDATE estilos SET nome='$name' WHERE id = $id";
    try {
      $qr=$pdo->query($sql);
      if($qr) {     
          $stmt=$pdo->query("SELECT * FROM estilos WHERE id = $id");
          
          if($row=$stmt->fetch(PDO::FETCH_OBJ)) {          
            echo json_encode(array('status'=>'success','key'=>$key,'result'=>$row));
          }          
      }
      else
       echo json_encode(array('status'=>'erro','msg'=>'Problema desconhecido, contate o programador: neiamaralf@athena3d.com.br'));
    }
    catch(PDOException $e) {
      echo json_encode(array('status'=>'erro','msg'=>$e->getMessage()));
    }
  }  
  break;
  case "getartistas":
  $op=$json_obj->{'jsondata'}->{'op'};
  if($op=="adicionar"){
    $name=$json_obj->{'jsondata'}->{'name'};
    $idcategoria=$json_obj->{'jsondata'}->{'idcategoria'};
    $idadmin=$json_obj->{'jsondata'}->{'idadmin'};
    $sql="INSERT INTO artistas(nome,idcategoria,idadmin) VALUES('$name',$idcategoria,$idadmin)";  
    try {
      $qr=$pdo->query($sql);
      if($qr) {     
          $stmt=$pdo->query("SELECT * FROM artistas WHERE idcategoria = $idcategoria AND id = (SELECT MAX(ID) FROM artistas WHERE idcategoria = $idcategoria)");
          
          if($row=$stmt->fetch(PDO::FETCH_OBJ)) {          
            echo json_encode(array('status'=>'success','result'=>$row));
          }          
      }
      else
       echo json_encode(array('status'=>'erro','msg'=>'Problema desconhecido, contate o programador: neiamaralf@athena3d.com.br'));
    }
    catch(PDOException $e) {
      echo json_encode(array('status'=>'erro','msg'=>$e->getMessage()));
    }

  }
  else{
  $name=$json_obj->{'jsondata'}->{'name'};
  $id=$json_obj->{'jsondata'}->{'id'};  
  $sql="UPDATE artistas SET nome='$name' WHERE id = $id";
  try {
    $qr=$pdo->query($sql);
    if($qr) {     
        $stmt=$pdo->query("SELECT * FROM artistas WHERE id = $id");
        
        if($row=$stmt->fetch(PDO::FETCH_OBJ)) {          
          echo json_encode(array('status'=>'success','result'=>$row));
        }          
    }
    else
     echo json_encode(array('status'=>'erro','msg'=>'Problema desconhecido, contate o programador: neiamaralf@athena3d.com.br'));
  }
  catch(PDOException $e) {
    echo json_encode(array('status'=>'erro','msg'=>$e->getMessage()));
  }
}
  break;
}


?>