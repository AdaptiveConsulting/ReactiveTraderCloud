using System;
using System.Globalization;
using System.Text;
using System.Threading;

namespace Adaptive.ReactiveTrader.Client.Domain.Instrumentation
{
    /// <summary>
    /// Histogram for tracking the frequency of observations of values below interval upper bounds.
    /// This class is useful for recording timings in nanoseconds across a large number of observations
    /// when high performance is required.
    /// </summary>
    public class Histogram
    {
        private readonly long[] _upperBounds;
        private readonly long[] _counts;
        private long _minValue = long.MaxValue;
        private long _maxValue;

        /// <summary>
        /// Create a new Histogram with a provided list of interval bounds.
        /// </summary>
        /// <param name="upperBounds">upperBounds of the intervals.</param>
        public Histogram(long[] upperBounds)
        {
            ValidateBounds(upperBounds);

            _upperBounds = new long[upperBounds.Length];

            Array.Copy(upperBounds, _upperBounds, upperBounds.Length);
            _counts = new long[upperBounds.Length];
        }

        private static void ValidateBounds(long[] upperBounds)
        {
            long lastBound = -1L;
            foreach (long bound in upperBounds)
            {
                if (bound <= 0L)
                {
                    throw new ArgumentOutOfRangeException("upperBounds", "Bounds must be positive values");
                }

                if (bound <= lastBound)
                {
                    throw new ArgumentOutOfRangeException("upperBounds", "bound " + bound + " is not greater than " + lastBound);
                }

                lastBound = bound;
            }
        }

        /// <summary>
        /// Size of the list of interval bars.
        /// </summary>
        public int Size
        {
            get { return _upperBounds.Length; }
        }

        /// <summary>
        /// Get the upper bound of an interval for an index.
        /// </summary>
        /// <param name="index">index of the upper bound.</param>
        /// <returns>the interval upper bound for the index.</returns>
        public long GetUpperBoundAt(int index)
        {
            return _upperBounds[index];
        }

        /// <summary>
        /// Get the count of observations at a given index.
        /// </summary>
        /// <param name="index">index of the observations counter.</param>
        /// <returns>the count of observations at a given index.</returns>
        public long GetCountAt(int index)
        {
            return _counts[index];
        }

        /// <summary>
        /// Add an observation to the histogram and increment the counter for the interval it matches.
        /// </summary>
        /// <param name="value">value for the observation to be added.</param>
        /// <returns>return true if in the range of intervals otherwise false.</returns>
        public bool AddObservation(long value)
        {
            int low = 0;
            int high = _upperBounds.Length - 1;

            while (low < high)
            {
                int mid = low + ((high - low) >> 1);
                if (_upperBounds[mid] < value)
                {
                    low = mid + 1;
                }
                else
                {
                    high = mid;
                }
            }

            if (value <= _upperBounds[high])
            {
                _counts[high]++;
                TrackRange(value);

                return true;
            }

            return false;
        }

        private void TrackRange(long value)
        {
            if (value < _minValue)
            {
                _minValue = value;
            }
            if (value > _maxValue)
            {
                _maxValue = value;
            }
        }

        /// <summary>
        /// Add observations from another Histogram into this one.
        /// Histograms must have the same intervals.
        /// </summary>
        /// <param name="histogram">histogram from which to add the observation counts.</param>
        public void AddObservations(Histogram histogram)
        {
            if (_upperBounds.Length != histogram._upperBounds.Length)
            {
                throw new ArgumentException("Histograms must have matching intervals", "histogram");
            }

            for (int i = 0; i < _upperBounds.Length; i++)
            {
                if (_upperBounds[i] != histogram._upperBounds[i])
                {
                    throw new ArgumentException("Histograms must have matching intervals", "histogram");
                }
            }

            for (int i = 0; i < _counts.Length; i++)
            {
                _counts[i] += histogram._counts[i];
            }

            TrackRange(histogram._minValue);
            TrackRange(histogram._maxValue);
        }

        /// <summary>
        /// Clear the list of interval counters.
        /// </summary>
        public void Clear()
        {
            _maxValue = 0L;
            _minValue = long.MaxValue;

            for (int i = 0; i < _counts.Length; i++)
            {
                _counts[i] = 0L;
            }
        }

        /// <summary>
        /// Count total number of recorded observations.
        /// </summary>
        /// <returns>the total number of recorded observations.</returns>
        public long Count
        {
            get
            {
                long count = 0L;

                for (int i = 0; i < _counts.Length; i++)
                {
                    count += _counts[i];
                }

                return count;
            }
        }

        /// <summary>
        /// Get the minimum observed value.
        /// </summary>
        public long Min
        {
            get { return _minValue; }
        }

        /// <summary>
        /// Get the maximum observed value.
        /// </summary>
        public long Max
        {
            get { return _maxValue; }
        }

        /// <summary>
        /// Calculate the mean of all recorded observations.
        /// 
        /// The mean is calculated by the summing the mid points of each interval multiplied by the count
        /// for that interval, then dividing by the total count of observations.  The max and min are
        /// considered for adjusting the top and bottom bin when calculating the mid point.
        /// </summary>
        public decimal Mean
        {
            get
            {
                if (Count == 0)
                {
                    return 0;
                }

                var lowerBound = _counts[0] > 0L ? _minValue : 0L;
                decimal total = 0;

                for (var i = 0; i < _upperBounds.Length; i++)
                {
                    if (0L != _counts[i])
                    {
                        var upperBound = Math.Min(_upperBounds[i], _maxValue);
                        var midPoint = lowerBound + ((upperBound - lowerBound) / 2L);

                        var intervalTotal = midPoint * _counts[i];
                        total += intervalTotal;
                    }

                    lowerBound = Math.Max(_upperBounds[i] + 1L, _minValue);
                }

                return Math.Round(total / Count, 2, MidpointRounding.AwayFromZero);
            }
        }

        ///<summary>
        /// Calculate the upper bound within which 99% of observations fall.
        ///</summary>
        public long TwoNinesUpperBound
        {
            get { return GetUpperBoundForFactor(0.99d); }
        }

        ///<summary>
        /// Calculate the upper bound within which 99.99% of observations fall.
        ///</summary>
        public long FourNinesUpperBound
        {
            get { return GetUpperBoundForFactor(0.9999d); }
        }

        /// <summary>
        /// Get the interval upper bound for a given factor of the observation population.
        /// </summary>
        /// <param name="factor">factor representing the size of the population.</param>
        /// <returns>the interval upper bound.</returns>
        public long GetUpperBoundForFactor(double factor)
        {
            if (0.0d >= factor || factor >= 1.0d)
            {
                throw new ArgumentException("factor must be >= 0.0 and <= 1.0", "factor");
            }

            var totalCount = Count;
            var tailTotal = (long)(totalCount - Math.Round(totalCount * factor));
            var tailCount = 0L;

            for (int i = _counts.Length - 1; i >= 0; i--)
            {
                if (0L != _counts[i])
                {
                    tailCount += _counts[i];
                    if (tailCount >= tailTotal)
                    {
                        return _upperBounds[i];
                    }
                }
            }

            return 0L;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            var culture = CultureInfo.InvariantCulture;
            var sb = new StringBuilder();

            sb.Append("Histogram{");

            sb.Append("min=").Append(Min.ToString(culture)).Append(", ");
            sb.Append("max=").Append(Max.ToString(culture)).Append(", ");
            sb.Append("mean=").Append(Mean.ToString(culture)).Append(", ");
            sb.Append("99%=").Append(TwoNinesUpperBound.ToString(culture)).Append(", ");
            sb.Append("99.99%=").Append(FourNinesUpperBound.ToString(culture)).AppendLine(", ");

            sb.Append('[');
            for (var i = 0; i < _counts.Length; i++)
            {
                sb.Append(_upperBounds[i]).Append('=').Append(_counts[i].ToString(culture)).AppendLine();
            }

            if (_counts.Length > 0)
            {
                sb.Length = (sb.Length - 2);
            }
            sb.Append(']');

            sb.Append('}');

            return sb.ToString();
        }
    }
}