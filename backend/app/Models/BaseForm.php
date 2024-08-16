<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BaseForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'input_field',
        'number_field',
        'select_single_field',
        'select_multiple_field',
        'cascading_field',
        'tree_field',
        'date_field',
        'rich_text_field',
        'image_field',
    ];
}
