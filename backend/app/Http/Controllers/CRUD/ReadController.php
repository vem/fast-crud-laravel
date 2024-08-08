<?php

namespace App\Http\Controllers\CRUD;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ReadController extends Controller
{
    public function getList($table): JsonResponse
    {
        $page   = request('page');
        $limit  = $page['limit'] ?? 10;
        $offset = $page['offset'] ?? 0;

        $model = 'App\\Models\\' . ucfirst($table);
        $list  = $model::paginate($limit, ['*'], 'page', $offset);

        return response()->json([
            'code' => 0,
            'data' => [
                'limit'   => $limit,
                'offset'  => $offset,
                'records' => $list->items(),
                'total'   => $list->total(),
            ],
        ]);
    }

    public function getDict($table): JsonResponse
    {
        $model = 'App\\Models\\' . ucfirst($table);
        $list  = $model::all();

        return response()->json([
            'code' => 0,
            'data' => $list,
        ]);
    }
}
