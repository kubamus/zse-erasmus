<div class="container">
    <?php if (!empty($doctors)): ?>
        <ul>
            <?php foreach ($doctors as $doctor): ?>
                <li>
                    <?= htmlspecialchars($doctor->name) ?> <?= htmlspecialchars($doctor->lastname) ?>
                </li>
            <?php endforeach; ?>
        </ul>
    <?php else: ?>
        <p>No hay doctores disponibles.</p>
    <?php endif; ?>

</div>



