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
  echo json_encode(array('key'=>$key,'result'=>$data));
 } 
 break;
 case 'getartistas':
 $idcategoria=$_REQUEST['idcategoria'];
 $idadmin=$_REQUEST['idadmin'];
 if($idadmin=='undefined')
 $sql="SELECT *  FROM artistas  WHERE  idcategoria=$idcategoria  ORDER BY nome";
 else
 $sql="SELECT *  FROM artistas  WHERE  idcategoria=$idcategoria AND idadmin=$idadmin ORDER BY nome";
 $stmt=$pdo->query($sql);
 if($stmt->rowCount()>0){
  while($row=$stmt->fetch(PDO::FETCH_OBJ)){
   $data[]=$row;
  }
  echo json_encode(array('key'=>$key,'result'=>$data));
 } 
 break;
}

?>