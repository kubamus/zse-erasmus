<?php
    if (!isset($conn) || !($conn instanceof PDO)) {
        include_once(dirname(__DIR__, 3) . '/database/Database.php');
        $conn = (new Database())->connect();
    }

    $doctors = [];
    if ($conn instanceof PDO) {
        $queryDoctors = "
            SELECT
                d.id,
                d.name,
                d.phone_number,
                COALESCE(GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR ', '), '-') AS specializations,
                COALESCE(GROUP_CONCAT(DISTINCT dep.name ORDER BY dep.name SEPARATOR ', '), '-') AS departments
            FROM doctors d
            LEFT JOIN specialization_has_doctors shd ON shd.doctors_id = d.id
            LEFT JOIN specialization s ON s.id = shd.specialization_id
            LEFT JOIN departments_has_doctors dhd ON dhd.doctors_id = d.id
            LEFT JOIN departments dep ON dep.id = dhd.departments_id
            GROUP BY d.id, d.name, d.phone_number
            ORDER BY d.name
        ";
        $stmtDoctors = $conn->prepare($queryDoctors);
        $stmtDoctors->execute();
        $doctors = $stmtDoctors->fetchAll(PDO::FETCH_ASSOC);
    }
?>

<div class="container">
    <div>
        <form enctype="application/x-www-form-urlencoded" class="d-flex gap-2">
            <input type="text" id="filtered-text" autocomplete="off" name="name" class="form-control" placeholder="Search for doctors...">
        </form>
    </div>

    <div class="mt-3">
        <h2>Doctors List</h2>
    </div>

    <div class="row g-3">
        <?php foreach ($doctors as $doctor): ?>
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><?php echo htmlspecialchars((string)($doctor['name'] ?? 'Unknown Doctor')); ?></h5>
                        <p class="card-text mb-3">
                            specialization: <?php echo htmlspecialchars((string)($doctor['specializations'] ?? '-')); ?><br>
                        </p>
                        <p class="card-text mb-3">
                            department: <?php echo htmlspecialchars((string)($doctor['departments'] ?? '-')); ?>
                        </p>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

    <nav aria-label="Page navigation example" class="d-flex justify-content-center mt-4">
        <ul class="pagination">
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
</div>


<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script>
    $(document).ready(function() {
        const doctorsContainer = $('.row.g-3');
        const initialDoctorsHtml = doctorsContainer.html();
        let activeRequest = null;

        $('#filtered-text').on('input', function() {
            const name = $(this).val().trim();

            if (name === '') {
                if (activeRequest) {
                    activeRequest.abort();
                    activeRequest = null;
                }
                doctorsContainer.html(initialDoctorsHtml);
                return;
            }

            if (activeRequest) {
                activeRequest.abort();
            }

            activeRequest = $.ajax({
                url: './api/filter-doctors.php',
                method: 'GET',
                data: { name: name },
                dataType: 'json',
                success: function(response) {
                    doctorsContainer.empty();

                    if (!Array.isArray(response) || response.length === 0) {
                        doctorsContainer.append('<p class="text-center">No doctors found.</p>');
                        return;
                    }

                    response.forEach(function(doctor) {
                        const doctorCard = `
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">${doctor.name}</h5>
                                        <p class="card-text mb-3">
                                            specialization: ${doctor.specializations}<br>
                                        </p>
                                        <p class="card-text mb-3">
                                            department: ${doctor.departments}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        `;
                        doctorsContainer.append(doctorCard);
                    });
                },
                error: function(xhr, status) {
                    if (status !== 'abort') {
                        alert('An error occurred while fetching doctors. Please try again.');
                    }
                },
                complete: function() {
                    activeRequest = null;
                }
            });
        });
    });
</script>