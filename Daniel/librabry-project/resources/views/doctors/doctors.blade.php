<h2>Doctors list</h2>
<table>
    <thead><tr>
        <th>id</th>
        <th>name</th>
        <th>lastname</th>
        <th>specialization</th>
        <th>department</th>
    </tr></thead>

    <tbody>
        @foreach($doctors as $doctor)
            <tr>
                <td>{{ $doctor->id }}</td>
                <td>{{ $doctor->name }}</td>
                <td>{{ $doctor->lastname }}</td>
                <td>{{ $doctor->specialization?->specialization ?? 'N/A' }}</td>
                <td>{{ $doctor->department?->department ?? 'N/A' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>