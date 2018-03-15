<?php
header('Access-Control-Allow-Origin: *');
include 'conexao.php';
$key= $_REQUEST['key'];
switch($key) {
 case 'getestilos':
 $idcategoria=$_REQUEST['idcategoria'];
 $sql="SELECT *  FROM estilos  WHERE  idcategoria=$idcategoria ORDER BY nome";
 $stmt=$pdo->query($sql);
 if($stmt->rowCount()>0){
  while($row=$stmt->fetch(PDO::FETCH_OBJ)){
   $data[]=$row;
  }
  echo json_encode($data);
 } 
 break;
}

?>