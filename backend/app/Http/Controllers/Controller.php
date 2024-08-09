<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class Controller
{
    public function response($msg = 'success', $data = ''): JsonResponse
    {
        return response()->json([
            'code' => $msg === 'success' ? 0 : 1,
            'msg'  => $msg,
            'data' => $data,
        ]);
    }
}
