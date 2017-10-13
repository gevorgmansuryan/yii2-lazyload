<?php

namespace Gevman\LazyLoad;

use Gevman\LazyLoad\assets\LazyAsset;
use yii\base\Widget;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;

class LazyBlock extends Widget
{
    const EFFECT_SLIDE_UP = 'effect-slideup';
    const EFFECT_SLIDE_DOWN = 'effect-slidedown';
    const EFFECT_SLIDE_FROM_LEFT = 'effect-slidefromleft';
    const EFFECT_SLIDE_FROM_RIGHT = 'effect-slidefromright';
    const EFFECT_ZOOM_IN = 'effect-zoomin';
    const EFFECT_ZOOM_OUT = 'effect-zoomout';
    const EFFECT_ROTATE = 'effect-rotate';
    const EFFECT_SKEW = 'effect-skew';

    public $effect = self::EFFECT_SLIDE_UP;
    public $delay = 0;
    public $speed = 600;
    public $options = [
        'class' => []
    ];

    public function init()
    {
        parent::init();
        $this->view->registerAssetBundle(LazyAsset::class);
        ob_start();
    }

    public function run()
    {
        $this->options['id'] = $this->id;
        $this->options['class'] = ArrayHelper::toArray(ArrayHelper::getValue($this->options, 'class', []));
        if ($this->effect) {
            $this->options = ArrayHelper::merge(
                $this->options, [
                    'class' => [
                        'lazy-load-box',
                        'trigger',
                        $this->effect
                    ],
                    'style' => [
                        '-webkit-transition' => "all {$this->speed}ms ease",
                        '-moz-transition' => "all {$this->speed}ms ease",
                        '-ms-transition' => "all {$this->speed}ms ease",
                        '-o-transition' => "all {$this->speed}ms ease",
                        'transition' => "all {$this->speed}ms ease",
                    ],
                    'data' => [
                        'delay' => $this->delay,
                        'speed' => $this->speed
                    ]
                ]
            );
        }

        return Html::tag('div', ob_get_clean(), $this->options);
    }
}