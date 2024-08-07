<?php

namespace App\Http\Controllers\CRUD;

use App\Http\Controllers\Controller;

class ReadController extends Controller
{
    //
    public function getList()
    {
        return response()->json([
            'code' => 0,
            'data' => [
                'total' => 0,
                'list'  => [],
            ],
        ]);
    }
}
