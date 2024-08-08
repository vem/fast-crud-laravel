<?php

namespace App\Http\Controllers\CRUD;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CreateController extends Controller
{
    public function index($table)
    {
        $model = 'App\\Models\\' . ucfirst($table);
        $data  = request()->all();
        $id    = $data['id'] ?? null;
        $model::updateOrCreate(['id' => $id], $data);
        return response()->json(['code' => 0]);
    }
}
