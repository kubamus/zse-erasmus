@extends('templates.master')

@section('custom_styles')
    <style></style>
@endsection

@section('content')
    <div class="container">
        <h2>Doctors list</h2>

        <!-- Button trigger modal -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createDoctor">
            Create doctor
        </button>

        @if ($errors->any())
            <div class="alert alert-danger mt-3">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif
        <table class="table table-resonsive">
            <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>lastname</th>
                    <th>specialization</th>
                    <th>department</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                @foreach ($doctors as $doctor)
                    <tr>
                        <td>{{ $doctor->id }}</td>
                        <td>{{ $doctor->name }}</td>
                        <td>{{ $doctor->lastname }}</td>
                        <td>{{ $doctor->specialization?->specialization ?? 'N/A' }}</td>
                        <td>{{ $doctor->department?->department ?? 'N/A' }}</td>
                        <td colspan="3">
                            <form action="{{ route('delete-doctor') }}" method="POST" enctype="application/x-www-form-urlencoded">
                                @csrf
                                <input type="hidden" name="doctor_id" id="doctor_id" value="{{ $doctor->id }}">
                                <button>Delete</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>



    <!-- Modal -->
    <div class="modal fade" id="createDoctor" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form action="{{ route('save-doctor')}}" method="POST" enctype="application/x-www-form-urlencoded">
                        @csrf
                        <div class="mb-3">
                            <label for="Name" class="form-label">Name</label>
                            <input type="text" class="form-control" id="Name" name="name">
                            <div id="nameHelp" class="form-text">Enter your name</div>
                        </div>
                        <div class="mb-3">
                            <label for="Lastname" class="form-label">Lastname</label>
                            <input type="text" class="form-control" id="Lastname" name="lastname">
                            <div id="lastnameHelp" class="form-text">Enter your lastname</div>
                        </div>

                        <div class="mb-3">
                            <label for="phoneNumber" class="form-label">Phone Number</label>
                            <input type="text" class="form-control" id="phoneNumber" name="phone_number">
                            <div id="phoneNumberHelp" class="form-text">Enter your phone number</div>
                        </div>

                        <div class="mb-3">
                            <label for="specialization" class="form-label">Specialization</label>
                            <select class="form-select" id="specialization" name="specialization_id">
                                <option value="" selected>Open this select menu</option>
                                @foreach ($specializations as $specialization)
                                    <option value="{{ $specialization->id }}">{{ $specialization->specialization }}</option>
                                @endforeach
                            </select>
                            <div id="specializationHelp" class="form-text">Enter your specialization</div>
                        </div>
                        <div class="mb-3">
                            <label for="department" class="form-label">Department</label>
                            <select class="form-select" id="department" name="department_id" aria-label="Default select example">
                                <option value="" selected>Open this select menu</option>
                                @foreach ($departments as $department)
                                    <option value="{{ $department->id }}">{{ $department->department }}</option>
                                @endforeach
                            </select>
                            <div id="departmentHelp" class="form-text">Enter your department</div>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('custom_scripts')
@endsection
