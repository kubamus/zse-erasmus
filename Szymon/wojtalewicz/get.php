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
		<h2>Contact Doctors</h2>
		<form method="GET" action="" style="margin-bottom: 20px;" id="searchForm" autocomplete="off">
			<input type="text" id="searchInput" name="search_name" placeholder="Write name..." autocomplete="off" value="<?php echo isset($_GET['search_name']) ? htmlspecialchars($_GET['search_name']) : ''; ?>">
		</form>

		<div style="background-color: #e9ecef; padding: 10px; margin-bottom: 20px; border-radius: 4px; border-left: 4px solid #0066cc; font-size: 0.95rem; color: #555;">
			<strong>Display:</strong> Specialization: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Name - Phone Number
		</div>

		<div id="doctor-results">
		<?php
		$connected = mysqli_connect("localhost", "root", "", "hospital_management");
		if (!$connected) {
			die("Connection failed: " . mysqli_connect_error());
		}
		
		$query = "SELECT * FROM doctor";
		if (!empty($_GET['search_name'])) {
			$search = mysqli_real_escape_string($connected, $_GET['search_name']);
			$query .= " WHERE name LIKE '%$search%' OR specialization LIKE '%$search%' OR phone_number LIKE '%$search%'";
		}
		
		$result = mysqli_query($connected, $query);
		if (mysqli_num_rows($result) > 0) {
			foreach (mysqli_fetch_all($result, MYSQLI_ASSOC) as $row) {
				echo "<div class='patient-card'>";
				echo "<p>" . htmlspecialchars($row['specialization']) . ": &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; " . htmlspecialchars($row['name']) . " - " . htmlspecialchars($row['phone_number']) . "</p>";
				echo "</div>";
			}
		} else {
			echo "<div class='patient-card' style='text-align: center;'>";
			echo "<p>No results found.</p>";
			echo "</div>";
		}
		?>
		</div>
	</main>

	<?php include 'assets/footer.php'; ?>

	<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
	<script>
		$(document).ready(function() {
			$('#searchInput').on('input', function() {
				var searchValue = encodeURIComponent($(this).val());
				// Funkcja load() pobierze stronę i wyciągnie z niej tylko środek elementu #doctor-results
				$('#doctor-results').load('?search_name=' + searchValue + ' #doctor-results > *');
			});

			$('#searchForm').on('submit', function(e) {
				e.preventDefault(); // Blokujemy standardowe przeładowanie formularza po wciśnięciu Enter
			});
		});
	</script>
</body>

</html>