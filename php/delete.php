<?php
 header('Access-Control-Allow-Origin: *'); 
 include 'conexao.php';
 $key= $_REQUEST['key'];
 switch($key) {
  case 'estilos':
  $id=$_REQUEST['id'];
  $sql="DELETE FROM estilos  WHERE  id=$id";
  $stmt=$pdo->query($sql);
  if($stmt){
   echo json_encode(array('status'=>'success'));
  } 
  break;
  case 'artistas':
  $id=$_REQUEST['id'];
  $sql="DELETE FROM artistas  WHERE  id=$id";
  $stmt=$pdo->query($sql);
  if($stmt){
   echo json_encode(array('status'=>'success'));
  } 
  break;
 }
 ?>