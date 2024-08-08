<?php

namespace App\Http\Controllers\CRUD;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DeleteController extends Controller
{
    public function index($table)
    {
        $model = 'App\\Models\\' . ucfirst($table);
        $model::destroy(request('id'));
        return response()->json(['code' => 0]);
    }
}
