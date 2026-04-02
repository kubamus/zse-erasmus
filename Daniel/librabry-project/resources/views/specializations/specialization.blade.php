<h2>Specialization</h2>

<ul>
    @foreach ($specializations as $specialization)
        <li><a href="#{{ $specialization->id }}">{{ $specialization->specialization }}</a></li>
    @endforeach
</ul>