$host="localhost";
$port=3306;
$socket="";
$user="root";
$password="";
$dbname="pi_webinars";

$con = new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());

//$con->close();
