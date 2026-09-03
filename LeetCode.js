/**
 * @param {number} c
 * @return {boolean}
 */
var judgeSquareSum = function(c) {
    if(c == 0 || c == 1 || c == 2)
    {
        return true;
    }
	if(c == 3) return false;
    let l =0,r=Math.ceil(Math.sqrt(c));
    while(l <= r)
	{
		let res = l*l + r*r;
		if(res == c) return true;
		if(res > c) r--;
		if(res < c) l++;
	}
	return false;
};


/**
 * @param {string} s
 * @return {boolean}
 */
var validPalindrome = function(s) {
    let l =0,r=s.length-1;
    while(l<r)
    {
        if(s.charAt(l) == s.charAt(r))
        {
            l++;
            r--;
        }
        else
        {
            return IsPalindrome(s,l,r-1) || IsPalindrome(s,l+1,r);
        }
    }
    return true
};

function IsPalindrome(s,start,end)
{
	for(let l = start,r = end;l<r;)
	{
		if(s.charAt(l) != s.charAt(r))
		{
			return false;
		}
		else
		{
			l++;
			r--;
		}
	}
	return true;
}