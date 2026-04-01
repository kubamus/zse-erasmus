<h2>Departments list</h2>


<table>
    <thead>
        <tr><th>id</th><th>name</th></tr>
    </thead>
    <tbody>
        @foreach($departments as $department)
        <tr>
            <td>{{$department->id}}</td>
            <td>{{$department->department}}</td>
        </tr>
        @endforeach
    </tbody>
</table>