<h2>Specializations list</h2>
<table>
    <thead>
        <tr><th>id</th><th>name</th></tr>
    </thead>
    <tbody>
        @foreach($specializations as $specialization)
        <tr>
            <td>{{$specialization->id}}</td>
            <td>{{$specialization->specialization}}</td>
        </tr>
        @endforeach
    </tbody>
</table>