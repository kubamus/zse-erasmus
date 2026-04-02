@extends('templates.master')

@section('content')



<div class="container">
    <h2>Doctors list</h2>
    
    
    <table>
        <thead>
            <tr><th>id</th><th>name</th><th>lastname</th><th>department</th><th>specialization</th></tr>
        </thead>
        <tbody>
            @foreach($doctors as $doctor)
            <tr>
                <td>{{$doctor->id}}</td>
                <td>{{$doctor->name}}</td>
                <td>{{$doctor->lastname}}</td>
                <td>{{$doctor->department->department}}</td>
                <td>{{$doctor->specialization->specialization}}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>