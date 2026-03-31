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
		<h2>Check Appointment Details</h2>
		
		<form method="POST" action="">
			<input type="text" name="name" placeholder="Full Name" required>
			<input type="tel" name="phone_number" placeholder="Phone Number" required>
			<input type="date" name="date_of_birth" required>
			<button type="submit">Check Appointments</button>
		</form>

		<div style="margin-top: 2rem;">
			<?php
			if ($_SERVER['REQUEST_METHOD'] === 'POST') {
				$name = $_POST['name'] ?? '';
				$phone = $_POST['phone_number'] ?? '';
				$dob = $_POST['date_of_birth'] ?? '';

				$connected = mysqli_connect("localhost", "root", "", "hospital_management");
				if (!$connected) {
					die("Connection failed: " . mysqli_connect_error());
				}

				
				$name = mysqli_real_escape_string($connected, $name);
				$phone = mysqli_real_escape_string($connected, $phone);
				$dob = mysqli_real_escape_string($connected, $dob);

				
				$query = "
					SELECT a.* 
					FROM appointment a
					JOIN patient p ON a.patient_id = p.patient_id
					WHERE p.name = '$name' AND p.phone_number = '$phone' AND p.date_of_birth = '$dob'
				";

				$result = mysqli_query($connected, $query);

				if ($result && mysqli_num_rows($result) > 0) {
					echo "<h3>Your Appointments:</h3>";
					while ($row = mysqli_fetch_assoc($result)) {
						echo "<div class='patient-card'>";
						echo "<p><strong>Appointment ID:</strong> " . htmlspecialchars($row['appointment_id'] ?? '') . "</p>";
						echo "<p><strong>Doctor ID:</strong> " . htmlspecialchars($row['doctor_id'] ?? '') . "</p>";
						echo "<p><strong>Patient ID:</strong> " . htmlspecialchars($row['patient_id'] ?? '') . "</p>";
						echo "<p><strong>Consultation Type ID:</strong> " . htmlspecialchars($row['consultation_type_id'] ?? '') . "</p>";
						echo "<p><strong>Appointment Date:</strong> " . htmlspecialchars($row['appointment_date'] ?? '') . "</p>";
						echo "<p><strong>Appointment Time:</strong> " . htmlspecialchars($row['appointment_time'] ?? '') . "</p>";
						echo "</div>";
					}
				} else {
					echo "<p>No appointments found for the provided details.</p>";
				}

				mysqli_close($connected);
			}
			?>
		</div>
	</main>

	<?php include 'assets/footer.php'; ?>
</body>

</html>
