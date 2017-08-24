using System;
using Android.Content;
using Android.Graphics;
using Android.Util;
using Android.Views;

namespace Adaptive.ReactiveTrader.Client.Android.UI.SpotTiles
{
    public class DirectionArrow : View
    {
        private readonly Paint _mPaint = new Paint();
        private readonly Direction _dir;
        private Path _mPath;

        public enum Direction
        {
            Up,
            Down
        }

        public DirectionArrow(Context context)
            : base(context)
        {
            Create();
        }

        public DirectionArrow(Context context, IAttributeSet attrs)
            : base(context, attrs)
        {

            var dirAttr = attrs.GetAttributeValue(null, "direction");
            Enum.TryParse(dirAttr, out _dir);

            Create();
        }

        private void Create()
        {
            _mPaint.SetStyle(Paint.Style.Fill);

            // todo - move to color resource specified in xml
            if (_dir == Direction.Up)
            {
                _mPaint.Color = new Color(0x3F, 0xCF, 0x1E);
            }
            else
            {
                _mPaint.Color = new Color(0xCC, 0x33, 0x50);
            }
        }

        protected override void OnDraw(Canvas canvas)
        {
            _mPath = Calculate(MeasuredWidth, _dir);
            canvas.DrawPath(_mPath, _mPaint);
        }

        private Path Calculate(int size, Direction direction)
        {
            Point p1, p2, p3;

            if (direction == Direction.Up)
            {
                p1 = new Point(0, size);
                p2 = new Point(size, size);
                p3 = new Point(size / 2, 0);
            }
            else
            {
                p1 = new Point(0, 0);
                p2 = new Point(size, 0);
                p3 = new Point(size / 2, size);
            }

            var path = new Path();
            path.MoveTo(p1.X, p1.Y);
            path.LineTo(p2.X, p2.Y);
            path.LineTo(p3.X, p3.Y);

            return path;
        }
    }
}