<!DOCTYPE html>
<html lang="pl-PL">

<head>
	<meta charset="UTF-8">
	<title>Hospital</title>
	<link rel="stylesheet" href="assets/shader.css">
</head>

<body>
	<?php include 'assets/header.php'; ?>

	<main>
		<h2>Registered Patients</h2>
		<?php
		$connected = mysqli_connect("localhost", "root", "", "hospital_management");
		if (!$connected) {
			die("Connection failed: " . mysqli_connect_error());
		}
		$query = "SELECT * FROM patient";
		$result = mysqli_query($connected, $query);
		foreach (mysqli_fetch_all($result, MYSQLI_ASSOC) as $row) {
			echo "<div class='patient-card'>";
			echo "<p>" . htmlspecialchars($row['patient_id']) . " - " . htmlspecialchars($row['name']) . "</p>";
			echo "</div>";
		}
		?>
	</main>

	<?php include 'assets/footer.php'; ?>
</body>

</html>
