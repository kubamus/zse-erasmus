<h2>Departments</h2>

<ul>
    @foreach ($departments as $department)
        <li><a href="#{{ $department->id }}">{{ $department->department }}</a></li>
    @endforeach
</ul>