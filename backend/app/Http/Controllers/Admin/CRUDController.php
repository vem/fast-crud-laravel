<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class CRUDController extends Controller
{
    public function getList($table): JsonResponse
    {
        $page   = request('page');
        $limit  = $page['limit'] ?? 10;
        $offset = $page['offset'] ?? 0;

        $model = 'App\\Models\\' . ucfirst($table);
        $list  = $model::paginate($limit, ['*'], 'page', $offset);

        return $this->response('success', [
            'limit'   => $limit,
            'offset'  => $offset,
            'records' => $list->items(),
            'total'   => $list->total(),
        ]);
    }

    public function store($table): JsonResponse
    {
        $model = 'App\\Models\\' . ucfirst($table);
        $data  = request()->all();
        $id    = $data['id'] ?? null;

        try {
            $model::updateOrCreate(['id' => $id], $data);
            return $this->response();
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();
            $action       = $id ? 'Update' : 'Create';
            Log::error("$action failed: $errorMessage");
            return $this->response("$action failed: $errorMessage");
        }
    }

    public function delete($table): JsonResponse
    {
        $model = 'App\\Models\\' . ucfirst($table);
        $model::destroy(request('id'));
        return $this->response();
    }

    public function getDict($table): JsonResponse
    {
        $model = 'App\\Models\\' . ucfirst($table);
        $list  = $model::all();
        return $this->response('success', $list);
    }
}
