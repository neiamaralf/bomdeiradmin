<?php
 header('Access-Control-Allow-Origin: *'); 
 include 'conexao.php';
 $key= $_REQUEST['key'];
 switch($key) {
  case 'getestilos':
  $id=$_REQUEST['id'];
  $sql="DELETE FROM estilos  WHERE  id=$id";
  $stmt=$pdo->query($sql);
  if($stmt){
   echo json_encode(array('status'=>'success'));
  } 
  break;
  case 'getartistas':
  $id=$_REQUEST['id'];
  $sql="DELETE FROM artistas  WHERE  id=$id";
  $stmt=$pdo->query($sql);
  if($stmt){
   echo json_encode(array('status'=>'success'));
  } 
  break;
 }
 ?>