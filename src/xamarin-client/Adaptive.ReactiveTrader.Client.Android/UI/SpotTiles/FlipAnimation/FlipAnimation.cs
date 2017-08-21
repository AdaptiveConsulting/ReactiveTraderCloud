using Android.Graphics;
using Android.Views.Animations;

namespace Adaptive.ReactiveTrader.Client.Android.UI.SpotTiles
{
    class FlipAnimation : Animation
    {
        private readonly float _fromDegrees;
        private readonly float _toDegrees;
        private readonly float _centerX;
        private readonly float _centerY;
        private Camera _camera;

        private readonly ScaleUpDownEnum _scaleType;
	 
        /**
	    * How much to _scale up/down. The default _scale of 75% of full size seems optimal based on testing. Feel free to experiment away, however.
	    */ 
        public static float ScaleDefault = 0.2f;
        private readonly float _scale;

        public FlipAnimation(float fromDegrees, float toDegrees, float centerX, float centerY, float scale, ScaleUpDownEnum scaleType)
        {
            _fromDegrees = fromDegrees;
            _toDegrees = toDegrees;
            _centerX = centerX;
            _centerY = centerY;
            _scale = (scale <= 0 || scale >= 1) ? ScaleDefault : scale;
            _scaleType = scaleType;
            Direction = Direction.Y;
        }

        public override void Initialize(int width, int height, int parentWidth, int parentHeight)
        {
            base.Initialize(width, height, parentWidth, parentHeight);
            _camera = new Camera();
        }

        protected override void ApplyTransformation(float interpolatedTime, Transformation t)
        {
            float fromDegrees = _fromDegrees;
            float degrees = fromDegrees + ((_toDegrees - fromDegrees) * interpolatedTime);
            Camera camera = _camera;
            Matrix matrix = t.Matrix;

            camera.Save();

            if (Direction == Direction.X)
            {
                camera.RotateX(degrees);
            }
            else
            {
                camera.RotateY(degrees);
            }

            camera.GetMatrix(matrix);
            camera.Restore();

            matrix.PreTranslate(-_centerX, -_centerY);
            matrix.PostTranslate(_centerX, _centerY);

            matrix.PreScale(_scaleType.GetScale(_scale, interpolatedTime), _scaleType.GetScale(_scale, interpolatedTime), _centerX, _centerY);
        }

        public Direction Direction { get; set; }
    }
}