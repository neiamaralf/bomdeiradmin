<?php
header('Access-Control-Allow-Origin: *');
include 'conexao.php';
$key= $_REQUEST['key'];
switch($key) { 
 case 'estados':
 $sql="SELECT *  FROM estados  ORDER BY nome";
 $stmt=$pdo->query($sql);
 if($stmt->rowCount()>0){
  while($row=$stmt->fetch(PDO::FETCH_OBJ)){
   $data[]=$row;
  } 
  mb_convert_variables('UTF-8','ISO-8859-1',$data);
  echo json_encode(array('key'=>$key,'result'=>$data));
 } 
 break;
 case 'estadosevt':
 $idcategoria=$_REQUEST['idcategoria'];
 $sql="SELECT *  FROM estados WHERE uf IN (SELECT l.uf FROM locais AS l,eventos AS ev WHERE l.id=ev.idlocal AND ev.idcategoria=$idcategoria)  ORDER BY nome";
 $stmt=$pdo->query($sql);
 if($stmt->rowCount()>0){
  while($row=$stmt->fetch(PDO::FETCH_OBJ)){
   $data[]=$row;
  } 
  mb_convert_variables('UTF-8','ISO-8859-1',$data);
  echo json_encode(array('key'=>$key,'result'=>$data));
 } 
 break;
 case 'cidadesevt':
 $uf=$_REQUEST['uf'];
 $idcategoria=$_REQUEST['idcategoria'];
 $sql="SELECT *  FROM cidades WHERE nome IN (SELECT l.localidade FROM locais AS l,eventos AS ev WHERE l.id=ev.idlocal AND ev.idcategoria=$idcategoria AND l.uf='$uf')  ORDER BY nome";
 $stmt=$pdo->query($sql);
 if($stmt->rowCount()>0){
  while($row=$stmt->fetch(PDO::FETCH_OBJ)){
   $data[]=$row;
  } 
  mb_convert_variables('UTF-8','ISO-8859-1',$data);
  echo json_encode(array('key'=>$key,'result'=>$data));
 } 
 break;
 case 'bairrosevt':
 $uf=$_REQUEST['uf'];
 $cidade=$_REQUEST['cidade'];
 $idcategoria=$_REQUEST['idcategoria'];
 $sql="SELECT *  FROM bairros WHERE (nome IN (SELECT l.bairro FROM locais AS l,eventos AS ev WHERE l.id=ev.idlocal AND ev.idcategoria=$idcategoria AND l.uf='$uf')) AND  cidade='$cidade' ORDER BY nome";

 //$sql="SELECT *  FROM bairros WHERE cidade='$cidade'  ORDER BY nome";
 $stmt=$pdo->query($sql);
 if($stmt->rowCount()>0){
  while($row=$stmt->fetch(PDO::FETCH_OBJ)){
   $data[]=$row;
  } 
  mb_convert_variables('UTF-8','ISO-8859-1',$data);
  echo json_encode(array('key'=>$key,'result'=>$data));
 } 
 break;
 case 'estilos':
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
 case 'locais':
 $idcategoria=$_REQUEST['idcategoria'];
 $idadmin=$_REQUEST['idadmin'];
 if($idadmin=='undefined')
 $sql="SELECT *  FROM locais  WHERE  1 ORDER BY nome";
 else
 $sql="SELECT *  FROM locais  WHERE  idadmin=$idadmin ORDER BY nome";
 $stmt=$pdo->query($sql);
 if($stmt->rowCount()>0){
  while($row=$stmt->fetch(PDO::FETCH_OBJ)){
   $data[]=$row;
  } 
  echo json_encode(array('key'=>$key,'result'=>$data));
 } 
 break;
 case 'eventos':
 $idcategoria=$_REQUEST['idcategoria'];
 $idadmin=$_REQUEST['idadmin'];
 if($idadmin=='undefined')
 $sql="SELECT *  FROM eventos  WHERE  idcategoria=$idcategoria  ORDER BY nome";
 else
 $sql="SELECT *  FROM eventos  WHERE  idadmin=$idadmin AND idcategoria=$idcategoria ORDER BY nome";
 $stmt=$pdo->query($sql);
 if($stmt->rowCount()>0){
  while($row=$stmt->fetch(PDO::FETCH_OBJ)){
   $data[]=$row;
  } 
  echo json_encode(array('key'=>$key,'result'=>$data));
 } 
 break;
 case 'artistas':
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