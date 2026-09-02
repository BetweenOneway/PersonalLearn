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
    let ret = IsPalindrome(s);
	if(!ret)
	{
		for(let i=0;i<s.length;i++)
		{
			let newS = s.slice(0, i) + s.slice(i + 1);
			if(IsPalindrome(newS))
			{
				ret = true;
				break;
			}
		}
	}
	return ret;
};

function IsPalindrome(s)
{
	let num = s.length / 2;
	let l = 0,r = s.length - 1;
	for(let i=0;i<num;i++)
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