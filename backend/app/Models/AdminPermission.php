<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdminPermission extends Model
{
    use SoftDeletes;

    protected $table = 'admin_permissions';

    protected $fillable = [
        'title', 'permission', 'sort', 'parentId', 'dbTable',
    ];
}
