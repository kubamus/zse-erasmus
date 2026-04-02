<div class="container">

    <table class="table">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">first</th>
                <th scope="col">last</th>
                <th scope="col">specialized</th>
            </tr>
        </thead>
        <tbody>

        <?php if (!empty($doctors)): ?>

                <?php foreach ($doctors as $doctor): ?>
                <tr>
                    <th scope="row"><?= htmlspecialchars($doctor->docid) ?></th>
                    <td><?= htmlspecialchars($doctor->name) ?> </td>
                    <td><?= htmlspecialchars($doctor->lastname) ?></td>
                    <td><?= htmlspecialchars($doctor->department) ?></td>
                </tr>


                <?php endforeach; ?>

        <?php else: ?>
            <p>No hay doctores disponibles.</p>
        <?php endif; ?>

        </tbody>
    </table>




</div>



