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

        $modelPath     = 'App\\Models\\' . ucfirst($table);
        $model         = new $modelPath;
        $allowedFields = array_merge($model->getFillableFields(), ['id', 'created_at', 'updated_at', 'deleted_at']);

        $query = request('query') ?? [];
        foreach ($query as $key => $value) {
            if (!in_array($key, $allowedFields)) {
                continue;
            }
            if (gettype($value) === 'array') {
                $model = $model->where(function ($query) use ($key, $value) {
                    foreach ($value as $v) {
                        $query->orWhereRaw("JSON_CONTAINS($key, '\"$v\"')");
                    }
                });
            } else if (gettype($value) === 'string') {
                $model = $model->where($key, 'LIKE', "%$value%");
            }
        }

        $sort = request('sort') ?? [];
        if ($sort && isset($sort['order'])) {
            $orderField = $sort['prop'] ?? 'id';
            $orderType  = $sort['asc'] === 'true' ? 'asc' : 'desc';
            $model      = $model->orderBy($orderField, $orderType);
        }

        $records = $model->paginate($limit, ['*'], 'page', $offset);

        $return = [
            'limit'   => $limit,
            'offset'  => $offset,
            'records' => $records->items(),
            'total'   => $records->total(),
        ];
        if (config('app.debug')) {
            $return['sql'] = $model->toSql();
        }

        return $this->response('success', $return);
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
